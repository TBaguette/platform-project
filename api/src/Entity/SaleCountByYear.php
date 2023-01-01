<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use App\State\SaleCountByYearProvider;


#[ApiResource(
    paginationEnabled: false,
    operations: [
        new GetCollection(
            uriTemplate: 'count_by_year/{year}',
            openapiContext: [
                'parameters' => [
                    [
                        'name' => 'year',
                        'in' => 'path',
                        'required' => true,
                        'schema' => [
                            'type' => 'string',
                        ],
                        'example' => '2017',
                        'description' => 'Selection of the year of sale'
                    ]
                ]
            ],
            provider: SaleCountByYearProvider::class,
            description: 'Retrieves the number of sales for each region for the giving year'
        )
    ]
)]
class SaleCountByYear
{
    protected \DateTimeImmutable $date;

    protected string $region;
}
