<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use App\State\ModeProvider;


#[ApiResource(
    paginationEnabled: false,
    operations: [
        new GetCollection(
            uriTemplate: 'number_sales_by_date/{type}/{from}/{to}',
            openapiContext: [
                'parameters' => [
                    [
                        'name' => 'type',
                        'in' => 'path',
                        'required' => true,
                        'schema' => [
                            'type' => 'string',
                            'enum' => ['day', 'week', 'month', 'year']
                        ],
                        'description' => 'Selection the mode of the date'
                    ],
                    [
                        'name' => 'from',
                        'in' => 'path',
                        'required' => true,
                        'schema' => [
                            'type' => 'string',
                            'format' => 'date',
                        ],
                        'example' => '2017-07-01',
                        'description' => 'Selection of the start date, format : "YYYY-MM-DD"'
                    ],
                    [
                        'name' => 'to',
                        'in' => 'path',
                        'required' => true,
                        'schema' => [
                            'type' => 'string',
                            'format' => 'date',
                        ],
                        'example' => '2017-12-31',
                        'description' => 'Selection of the end date, format : "YYYY-MM-DD"'
                    ]
                ]
            ],
            provider: ModeProvider::class,
            description: 'Fetch all datas between two dates depending on the mode (day, week, month, year)'
        )
    ]
)]
class SaleByMode
{
    protected \DateTimeImmutable $date;

}
