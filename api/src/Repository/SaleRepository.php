<?php
// api/src/Repository/SaleRepository.php

namespace App\Repository;

use App\Entity\Sale;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class SaleRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Sale::class);
    }

    /**
     * Finds all sales within the given date range.
     *
     * @param \DateTimeImmutable $startDate
     * @param \DateTimeImmutable $endDate
     * @return Sale[]
     */
    public function findByDateRange(\DateTimeImmutable $startDate, \DateTimeImmutable $endDate): array
    {
        $queryBuilder = $this->createQueryBuilder('s')
            ->select('s.date as date')
            ->where('s.date BETWEEN :start_date AND :end_date')
            ->setParameter('start_date', $startDate)
            ->setParameter('end_date', $endDate)
            ->orderBy('s.date', 'ASC');

        return $queryBuilder->getQuery()->getResult();
    }

    /**
     * Finds the sale count for each region within the given date range.
     *
     * @param \DateTimeImmutable $startDate
     * @param \DateTimeImmutable $endDate
     * @return array
     */
    public function findSaleCountByRegion(\DateTimeImmutable $startDate, \DateTimeImmutable $endDate): array
    {
        $queryBuilder = $this->createQueryBuilder('s');
        $query = $queryBuilder
            ->select('s.region as region')
            ->addSelect('COUNT(s) as count')
            ->where('s.date BETWEEN :start_date AND :end_date')
            ->setParameter('start_date', $startDate)
            ->setParameter('end_date', $endDate)
            ->groupBy('s.region')
            ->getQuery();

        return $query->getResult();
    }


    /**
     * Finds all sales with the specified type within the given date range.
     *
     * @param string $type
     * @param \DateTimeImmutable $startDate
     * @param \DateTimeImmutable $endDate
     * @return Sale[]
     */
    public function findByTypeAndDateRange(string $type, \DateTimeImmutable $startDate, \DateTimeImmutable $endDate): array
    {
        $queryBuilder = $this->createQueryBuilder('s');
        $query = $queryBuilder
            ->select('s.price as price')
            ->addSelect('s.surface as surface')
            ->addSelect('s.date as date')
            ->where('LOWER(s.type) = LOWER(:type) AND s.date BETWEEN :start_date AND :end_date')
            ->setParameter('type', $type)
            ->setParameter('start_date', $startDate)
            ->setParameter('end_date', $endDate)
            ->getQuery();

        return $query->getResult();
    }

}
