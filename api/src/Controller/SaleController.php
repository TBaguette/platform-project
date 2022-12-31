<?php

namespace App\Controller;

use Nelmio\ApiDocBundle\Annotation\Model;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Sale;

#[Route("/sales")]
class SaleController extends AbstractController 
{
    #[Route('/count-by-year/{year}', name: 'count_by_year', methods: ['GET'])]
    public function countByDepAndYear(ManagerRegistry $doctrine, int $year): JsonResponse
    {
        $em = $doctrine->getManager();

        $startDate = new \DateTimeImmutable("{$year}-01-01");
        $endDate = new \DateTimeImmutable("{$year}-12-31");

        $queryBuilder = $em->createQueryBuilder()
            ->select('s.region as region')
            ->addSelect('COUNT(s) as count')
            ->from(Sale::class, 's')
            ->where('s.date BETWEEN :start_date AND :end_date')
            ->setParameter('start_date', $startDate)
            ->setParameter('end_date', $endDate)
            ->groupBy('s.region');

        $results = $queryBuilder->getQuery()->getResult();

        $total = 0;

        foreach ($results as $key => $value) {
            $total += $value['count'];
        }

        //transform region inside label and count inside value all in json
        $json = [];
        array_push($json, [
            'label' => "Autres",
            'value' => 0
        ]);

        foreach ($results as $key => $value) {
            if($value['count'] * 100 / $total < 5) {
                $json[0]['value'] += $value['count'] * 100 / $total;
            } else {
                array_push($json, [
                    'label' => $value['region'],
                    'value' => number_format($value['count'] * 100 / $total, 1)
                ]);
            }
        }

        $json[0]['value'] = number_format($json[0]['value'], 1);
        return new JsonResponse(json_encode($json), 200, [], true);
    }

    #[Route('/price-evolution/{type}', name: 'sale_price_evolution', methods: ['GET'])]
    public function getPriceEvolution(ManagerRegistry $doctrine, string $type): JsonResponse
    {
        $em = $doctrine->getManager();
        
        $startDate = new \DateTimeImmutable("2017-01-01");
        $endDate = new \DateTimeImmutable("2022-12-31");

        $queryBuilder = $em->createQueryBuilder()
            ->select('s.price as price')
            ->addSelect('s.surface as surface')
            ->addSelect('s.date as date')
            ->from(Sale::class, 's')
            ->where('LOWER(s.type) = LOWER(:type) AND s.date BETWEEN :start_date AND :end_date')
            ->setParameter('start_date', $startDate)
            ->setParameter('end_date', $endDate)
            ->setParameter('type', $type);

        $results = $queryBuilder->getQuery()->getResult();

        //calcul la somme des prix par mois et des surfaces par mois

        $sums = [];

        for ($year = 2017; $year <= 2022; $year++) {
            for ($month = 1; $month <= 12; $month++) {
                $date = \DateTime::createFromFormat('Y-m-d', "{$year}-{$month}-01");
                $sums[$date->format('m/Y')] = ['price' => 0, 'surface' => 0];
            }
        }
        
        foreach ($results as $sale) {
            $monthYear = $sale['date']->format('m/Y');
            $sums[$monthYear]['price'] += $sale['price'];
            $sums[$monthYear]['surface'] += $sale['surface'];
        }

        $final=[];
        // affiche le résultat
        foreach ($sums as $monthYear => $sum) {
            array_push($final, [
                'label' => $monthYear,
                'value' => $sum['price'] / ($sum['surface'] === 0 ? 1 : $sum['surface'])
            ]);
        }
        

        return new JsonResponse($final, 200);
    }

    #[Route('/countby/{type}/{from}/{to}', name: 'count', methods: ['GET'])]
    public function countBy(string $type, string $from, string $to, ManagerRegistry $doctrine): JsonResponse {
        if($type != 'day' && $type != 'week' && $type != 'month' && $type != 'year') {
            return new JsonResponse('Invalid type', 400);
        }
        if(!preg_match('/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/', $from) || !preg_match('/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/', $to)) {
            return new JsonResponse('Invalid date format', 400);
        }
        $em = $doctrine->getManager();
        $query = null;
        $query = $em->createQuery(
            'SELECT sale.date as date
            FROM App\Entity\Sale sale
            WHERE sale.date BETWEEN \'' . $from . '\' AND \'' . $to . '\''
        );
        $results = $query->getResult();
        $final = [];
        $date = new \DateTimeImmutable($from);
        $dateTo = new \DateTimeImmutable($to);
        $format = 'Y';
        $formatInterval = 'P1Y';
        switch($type) {
            case 'day':
                $format = 'd/m/Y';
                $formatInterval = 'P1D';
                break;
            case 'week':
                $format = 'W/Y';
                $formatInterval = 'P1W';
                break;
            case 'month':
                $format = 'm/Y';
                $formatInterval = 'P1M';
                break;
            case 'year':
            default:
                $format = 'Y';
                $formatInterval = 'P1Y';
                break;
        }

        while($date->format($format) != $dateTo->format($format)) {
            array_push($final, [
                'label' => $date->format($format),
                'value' => 0
            ]);
            $date = $date->add(new \DateInterval($formatInterval));
        }

        foreach($results as $result) {
            $date = $result['date']->format($format);
            $exist = false;
            foreach($final as $key => $value) {
                if($value['label'] == $date) {
                    $final[$key]['value']++;
                    $exist = true;
                }
            }
            if(!$exist) {
                array_push($final, [
                    'label' => $date,
                    'value' => 1
                ]);
            }
        }

        return new JsonResponse(json_encode($final), 200, [], true);
    }
}
