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

    #[Route('/countby/{type}/{from}/{to}', name: 'count', defaults: ['from' => '2000-01-01', 'to' => '2100-01-01'], methods: ['GET'])]
    public function countBy(string $type, string $from, string $to, ManagerRegistry $doctrine): JsonResponse {
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
        switch($type) {
            case 'day':
                while($date->format('d/m/Y') != $dateTo->format('d/m/Y')) {
                    $final[$date->format('d/m/Y')] = 0;
                    $date = $date->add(new \DateInterval('P1D'));
                }
            case 'month':
                while($date->format('m/Y') != $dateTo->format('m/Y')) {
                    $final[$date->format('m/Y')] = 0;
                    $date = $date->add(new \DateInterval('P1M'));
                }
            case 'year':
            default:
                while($date->format('Y') != $dateTo->format('Y')) {
                    $final[$date->format('Y')] = 0;
                    $date = $date->add(new \DateInterval('P1Y'));
                }
                break;
        }
        for($i = 0; $i < count($results); $i++) {
            switch($type) {
                case 'day':
                    if(isset($final[$results[$i]['date']->format('d/m/Y')])) {
                        $final[$results[$i]['date']->format('d/m/Y')]++;
                    } else {
                        $final[$results[$i]['date']->format('d/m/Y')] = 1;
                    }
                    break;
                case 'month':
                    if(isset($final[$results[$i]['date']->format('m/Y')])) {
                        $final[$results[$i]['date']->format('m/Y')]++;
                    } else {
                        $final[$results[$i]['date']->format('m/Y')] = 1;
                    }
                    break;
                case 'year':
                default:
                    if(isset($final[$results[$i]['date']->format('Y')])) {
                        $final[$results[$i]['date']->format('Y')]++;
                    } else {
                        $final[$results[$i]['date']->format('Y')] = 1;
                    }
                    break;
            }
        }

        return new JsonResponse(json_encode($final), 200, [], true);
    }
}
