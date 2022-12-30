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
            ->select('s.zip as zip')
            ->addSelect('COUNT(s) as count')
            ->from(Sale::class, 's')
            ->where('s.date BETWEEN :start_date AND :end_date')
            ->setParameter('start_date', $startDate)
            ->setParameter('end_date', $endDate)
            ->groupBy('s.zip');

        $results = $queryBuilder->getQuery()->getResult();

        $total = 0;

        foreach ($results as $key => $value) {
            $total += $value['count'];
        }

        //transform zip inside label and count inside value all in json
        $json = [];
        array_push($json, [
            'label' => "Autres",
            'value' => 0
        ]);

        foreach ($results as $key => $value) {
            if($value['count'] * 100 / $total < 1) {
                $json[0]['value'] += $value['count'] * 100 / $total;
            } else {
                array_push($json, [
                    'label' => $value['zip'],
                    'value' => $value['count'] * 100 / $total
                ]);
            }
        }
        return new JsonResponse(json_encode($json), 200, [], true);
    }

    #[Route('/price-evolution/{type}/{year}', name: 'sale_price_evolution', methods: ['GET'])]
    public function getPriceEvolution(ManagerRegistry $doctrine, string $type, int $year): JsonResponse
    {
        $em = $doctrine->getManager();
        
        $queryBuilder = $em->createQueryBuilder()
            ->select('MONTH(s.date) as month')
            ->addSelect('AVG(s.price / s.surface) as avg_price')
            ->from(Sale::class, 's')
            ->where('s.type = :type')
            ->andWhere('YEAR(s.date) = :year')
            ->setParameter('type', $type)
            ->setParameter('year', $year)
            ->groupBy('month')
            ->orderBy('month');

        $results = $queryBuilder->getQuery()->getResult();

        return new JsonResponse($results, 200);
    }

    #[Route('/countby/{type}/{from}/{to}', name: 'count', methods: ['GET'])]
    public function countBy(string $type, string $from, string $to, ManagerRegistry $doctrine): JsonResponse {
        if($type != 'day' && $type != 'month' && $type != 'year') {
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
