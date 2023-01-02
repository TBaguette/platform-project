<?php
// api/src/Entity/Sale.php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;


/** A Sale. */

#[ORM\Entity(repositoryClass: SaleRepository::class)]
class Sale
{
    /** The id of this sale. */
    #[ORM\Id, ORM\Column, ORM\GeneratedValue]
    private ?int $id = null;

    /** The price for a meter square */
    #[ORM\Column(type: 'float')]
    #[Assert\NotNull]
    public float $price = 0;

    /** The surface of this sale */
    #[ORM\Column(type: 'float')]
    #[Assert\NotNull]
    public float $surface = 0;

    /** The region of this sale */
    #[ORM\Column]
    #[Assert\NotBlank]
    public string $region = '';

    /** type of this sale */
    #[ORM\Column]
    #[Assert\NotBlank]
    public string $type = '';

    /** The date of this sale. */
    #[ORM\Column]
    #[Assert\NotNull]
    public ?\DateTime $date = null;

    public function __construct()
    {
        // ...
    }

    public function getId(): ?int
    {
        return $this->id;
    }
    /**
     * Finds all sales for a given year.
     *
     * @param \Doctrine\ORM\EntityManagerInterface $em
     * @param int $year
     * @return Sale[]
     */
    public static function findByYear(\Doctrine\ORM\EntityManagerInterface $em, int $year): array
    {
        $startDate = new \DateTimeImmutable("{$year}-01-01");
        $endDate = new \DateTimeImmutable("{$year}-12-31");

        $queryBuilder = $em->createQueryBuilder();
        $query = $queryBuilder
            ->select('s')
            ->from(Sale::class, 's')
            ->where($queryBuilder->expr()->between('s.date', ':start_date', ':end_date'))
            ->setParameter('start_date', $startDate)
            ->setParameter('end_date', $endDate)
            ->getQuery();

        return $query->getResult();
    }
}
