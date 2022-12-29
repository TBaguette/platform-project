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
    #[Route('/count-by-year', name: 'count_by_year', methods: ['GET'])]
    public function countByYear(ManagerRegistry $doctrine): JsonResponse
    {
        $em = $doctrine->getManager();

        $query = $em->createQuery(
            'SELECT s1.zip as zip,
                    ((COUNT(s1) * 100) / SUM(s1)) as count
            FROM App\Entity\Sale s1
            GROUP BY s1.zip'
        );
        $results = $query->getResult();

        return new JsonResponse(json_encode($results), 200, [], true);
    }
}
