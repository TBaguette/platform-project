<?php

namespace App\Tests\Api;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;

class SaleEvolutionTest extends ApiTestCase
{
    public function testEvolutionMaison(): void
    {
        $response = static::createClient()->request('GET', '/sale_evolution/Maison');

        $this->assertResponseStatusCodeSame(200);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            "@context" => "/contexts/SaleEvolution",
            "@id" => "/sale_evolution/Maison",
            "@type" => "hydra:Collection"
        ]);
    }

    public function testEvolutionAppartement(): void
    {
        $response = static::createClient()->request('GET', '/sale_evolution/Appartement');

        $this->assertResponseStatusCodeSame(200);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            "@context" => "/contexts/SaleEvolution",
            "@id" => "/sale_evolution/Appartement",
            "@type" => "hydra:Collection",
        ]);
    }
}