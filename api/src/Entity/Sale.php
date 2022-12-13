<?php
// api/src/Entity/Sale.php
namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/** A Sale. */
#[ORM\Entity]
#[ApiResource]
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

    /** ZIP code of this sale */
    #[ORM\Column]
    #[Assert\NotBlank]
    public string $zip = '';

    /** type code of this sale */
    #[ORM\Column]
    #[Assert\NotBlank]
    public string $type = '';

    /** The date of this sale. */
    #[ORM\Column]
    #[Assert\NotNull]
    public ?\DateTimeImmutable $date = null;

    public function __construct()
    {
        // ...
    }

    public function getId(): ?int
    {
        return $this->id;
    }
}