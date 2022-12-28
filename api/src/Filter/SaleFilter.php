<?php

namespace App\Filter;

use Symfony\Component\HttpFoundation\Request;
use ApiPlatform\Core\Serializer\Filter\FilterInterface;

class SaleFilter implements FilterInterface {
    public function apply(Request $request, bool $normalization, array $attributes, array &$context)
    {
    }

    public function getDescription(string $resourceClass): array
    {
        return [
            'from' => [
                'property' => null,
                'type' => 'string',
                'required' => false,
                'openapi' => [
                    'description' => 'From date e.g. 2020-09-01',
                ],
            ]
        ];
    }
}