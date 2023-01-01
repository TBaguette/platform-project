<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use App\State\SaleEvolutionProvider;


#[ApiResource(operations: [
    new GetCollection(
        uriTemplate: 'sale_evolution/{type}',
        openapiContext: [
            'parameters' => [
                [
                    'name' => 'type',
                    'in' => 'path',
                    'required' => true,
                    'schema' => [
                        'type' => 'string',
                        'enum' => ['Maison', 'Appartement']
                    ],
                    'description' => 'Selection of the type of sale (maison or appartement)'
                ]
            ]
        ],
        provider: SaleEvolutionProvider::class,
        description: 'Retrieves the evolution of the price for a meter square for the giving type of sale'
    )
])]
class SaleEvolution
{
    protected \DateTimeImmutable $date;

    protected float $price;

    protected float $surface;

}
