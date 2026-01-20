
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function findRestaurant() {
    const restaurants = await prisma.restaurant.findMany({
        where: {
            name: {
                contains: 'Gusteau',
                mode: 'insensitive'
            }
        }
    });
    console.log(JSON.stringify(restaurants, null, 2));
}

findRestaurant()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
