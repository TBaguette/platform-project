<?php

namespace App\Tests\Api;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;

class CountByTest extends ApiTestCase
{
    public function testCountByYear(): void
    {
        $response = static::createClient()->request('GET', '/number_sales_by_date/year/2018-01-01/2020-12-31');

        $this->assertResponseStatusCodeSame(200);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            "@context" => "/contexts/SaleByMode",
            "@id" => "/number_sales_by_date/year/2018-01-01/2020-12-31",
            "@type" => "hydra:Collection"
        ]);
        //$this->assertCount(3, $response->toArray()['hydra:member']);
    }

    public function testCountByMonth(): void
    {
        $response = static::createClient()->request('GET', '/number_sales_by_date/month/2019-07-01/2020-12-31');

        $this->assertResponseStatusCodeSame(200);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            "@context" => "/contexts/SaleByMode",
            "@id" => "/number_sales_by_date/month/2019-07-01/2020-12-31",
            "@type" => "hydra:Collection"
        ]);
        //$this->assertCount(18, $response->toArray()['hydra:member']);
    }

    public function testCountByWeek(): void
    {
        $response = static::createClient()->request('GET', '/number_sales_by_date/week/2020-01-01/2020-03-31');

        $this->assertResponseStatusCodeSame(200);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            "@context" => "/contexts/SaleByMode",
            "@id" => "/number_sales_by_date/week/2020-01-01/2020-03-31",
            "@type" => "hydra:Collection"
        ]);
        //$this->assertCount(14, $response->toArray()['hydra:member']);
    }
}