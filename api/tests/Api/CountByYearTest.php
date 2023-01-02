<?php

namespace App\Tests\Api;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;

class CountByYearTest extends ApiTestCase
{
    public function testCountByYear(): void
    {
        $response = static::createClient()->request('GET', '/count_by_year/2020');

        $this->assertResponseStatusCodeSame(200);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            "@context" => "/contexts/SaleCountByYear",
            "@id" => "/count_by_year/2020",
            "@type" => "hydra:Collection"
        ]);
    }
}