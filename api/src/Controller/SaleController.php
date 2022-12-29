<?php

namespace App\Controller;


use Nelmio\ApiDocBundle\Annotation\Model;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;

#[Route("/sales")]
class SaleController extends AbstractController 
{
    #[Route('/countby/{type}', name: 'count', methods: ['GET'])]
    public function countBy(string $type, ManagerRegistry $doctrine): JsonResponse {
        $em = $doctrine->getManager();

        $query = null;
        $query = $em->createQuery(
            'SELECT sale.date as date
            FROM App\Entity\Sale sale'
        );
        $results = $query->getResult();
        $final = [];
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
