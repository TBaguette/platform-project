<?php
namespace App\DataFixtures;

use App\Entity\Sale;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Monolog\DateTimeImmutable;

class SalesFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {
        // Get the content of a folder
        $files = scandir('./resources/sales');
        // iterate over each file
        foreach ($files as $file) {
            $count = 0;
            try {
                print_r($file . PHP_EOL);
                // check that the file ends with .csv
                if (!is_dir('./resources/sales' . $file) && substr($file, -4) === '.txt') {
                    // get the content of the file
                    $fileStream = fopen('./resources/sales/' . $file, 'r');
                    fgetcsv($fileStream, null, '|'); // Skip first line
                    while (($line = fgetcsv($fileStream, null, '|')) !== FALSE) {
                        if ($line[9] !== 'Vente' || $line[10] <= 0 || !in_array($line[36], ['Maison', 'Appartement', 'Dépendance']) || $line[38] <= 0)
                            continue;
                        // create a new sale
                        $sale = new Sale();
                        $sale->price = floatval($line[10]);
                        $sale->surface = floatval($line[38]);
                        $sale->zip = $line[16];
                        $sale->type = $line[36];
                        $strdate = $line[8];
                        $array_date = explode('/', $strdate);
                        $strdate = $array_date[2] . '-' . $array_date[1] . '-' . $array_date[0];
                        $date = new \DateTimeImmutable($strdate);
                        $sale->date = $date;
                        // save the sale
                        $manager->persist($sale);
                        $count++;
                    }
                    print_r($count . ' sales loaded' . PHP_EOL);
                }
            } catch (\Exception $e) {
                print_r($e->getMessage());
            }
        }
        $manager->flush();
        print_r('Sales fixtures loaded');
    }
}

// 8 -> Date
// 9 -> Type de vente
// 10 -> Prix
// 36 -> Type local
// 38 -> Surface bati
