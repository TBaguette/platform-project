<?php

namespace App\State;

use App\Repository\SaleRepository;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;

set_time_limit(300);

class ModeProvider implements ProviderInterface
{
    private $saleRepository;

    public function __construct(SaleRepository $saleRepository)
    {
        $this->saleRepository = $saleRepository;
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $date = new \DateTimeImmutable($uriVariables['from']);
        $dateTo = new \DateTimeImmutable($uriVariables['to']);
        $type = $uriVariables['type'];

        $results = $results = $this->saleRepository->findByDateRange($date, $dateTo);

        $final = [];

        $format = 'Y';
        $formatInterval = 'P1Y';
        switch($type) {
            case 'day':
                $format = 'd/m/Y';
                $formatInterval = 'P1D';
                break;
            case 'week':
                $format = 'W/o';
                $formatInterval = 'P1W';
                break;
            case 'month':
                $format = 'm/Y';
                $formatInterval = 'P1M';
                break;
            case 'year':
            default:
                $format = 'Y';
                $formatInterval = 'P1Y';
                break;
        }

        $added = [];
        while($date->format($format) != $dateTo->format($format)) {
            array_push($final, [
                'label' => $date->format($format),
                'value' => 0
            ]);
            array_push($added, $date->format($format));
            $date = $date->add(new \DateInterval($formatInterval));
        }
        if(!in_array($dateTo->format($format), $added)) {
            array_push($final, [
                'label' => $dateTo->format($format),
                'value' => 0
            ]);
        }

        foreach($results as $result) {
            $date = $result['date']->format($format);
            foreach($final as $key => $value) {
                if($value['label'] == $date) {
                    $final[$key]['value']++;
                }
            }
        }
        
        return $final;
    }
}
