<?php

namespace App\State;

use App\Repository\SaleRepository;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;

set_time_limit(120);

class SaleEvolutionProvider implements ProviderInterface
{
    private $saleRepository;

    public function __construct(SaleRepository $saleRepository)
    {
        $this->saleRepository = $saleRepository;
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $startDate = new \DateTimeImmutable("2017-01-01");
        $endDate = new \DateTimeImmutable("2022-12-31");

        $results = $this->saleRepository->findByTypeAndDateRange($uriVariables['type'], $startDate, $endDate);

        //calcul la somme des prix par mois et des surfaces par mois

        $sums = [];

        for ($year = 2017; $year <= 2022; $year++) {
            for ($month = 1; $month <= 12; $month++) {
                $date = \DateTime::createFromFormat('Y-m-d', "{$year}-{$month}-01");
                $sums[$date->format('m/Y')] = ['price' => 0, 'surface' => 0];
            }
        }
        
        foreach ($results as $sale) {
            $monthYear = $sale['date']->format('m/Y');
            $sums[$monthYear]['price'] += $sale['price'];
            $sums[$monthYear]['surface'] += $sale['surface'];
        }

        $final=[];
        // affiche le résultat
        foreach ($sums as $monthYear => $sum) {
            array_push($final, [
                'label' => $monthYear,
                'value' => $sum['price'] / ($sum['surface'] === 0 ? 1 : $sum['surface'])
            ]);
        }

        return $final;
    }
}
