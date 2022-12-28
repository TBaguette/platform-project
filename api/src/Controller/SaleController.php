<?php

namespace App\Controller;


use Nelmio\ApiDocBundle\Annotation\Model;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;

//import Sale entity
use App\Entity\Sale;

#[Route("/sales")]
class SaleController extends AbstractController
{
    #[Route('/count-by-year', name: 'count_by_year', methods: ['GET'])]
    public function countByYear(ManagerRegistry $doctrine): JsonResponse
    {
        $em = $doctrine->getManager();

        $query = $em->createQuery(
            'SELECT s.date as year,
                    COUNT(s) as count
            FROM App\Entity\Sale s
            GROUP BY year'
        );
        $results = $query->getResult();

        return new JsonResponse(json_encode($results), 200, [], true);
    }
}
