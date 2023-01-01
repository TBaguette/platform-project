<?php

namespace App\State;

use App\Repository\SaleRepository;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;

class SaleCountByYearProvider implements ProviderInterface
{
    private $saleRepository;

    public function __construct(SaleRepository $saleRepository)
    {
        $this->saleRepository = $saleRepository;
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $year = $uriVariables['year'];

        $startDate = new \DateTimeImmutable("{$year}-01-01");
        $endDate = new \DateTimeImmutable("{$year}-12-31");

        $results = $this->saleRepository->findSaleCountByRegion($startDate, $endDate);

        $total = 0;

        foreach ($results as $key => $value) {
            $total += $value['count'];
        }

        //transform region inside label and count inside value all in json
        $json = [];
        array_push($json, [
            'label' => "Autres",
            'value' => 0
        ]);

        foreach ($results as $key => $value) {
            if($value['count'] * 100 / $total < 5) {
                $json[0]['value'] += $value['count'] * 100 / $total;
            } else {
                array_push($json, [
                    'label' => $value['region'],
                    'value' => number_format($value['count'] * 100 / $total, 1)
                ]);
            }
        }

        $json[0]['value'] = number_format($json[0]['value'], 1);
        return $json;
    }
}
