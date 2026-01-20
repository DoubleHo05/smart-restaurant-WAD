const http = require('http');
const fs = require('fs');

const API_URL = 'http://localhost:3000/api/public/menu?limit=300';
const OUTPUT_FILE = 'update_menu_images.sql';

// Map specific keywords to Unsplash Image URLs
const imageMap = {
    'Burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
    'Pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
    'BBQ Ribs': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
    'Curry': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80',
    'Salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
    'Chicken': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80',
    'Sushi': 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&q=80',
    'Cake': 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80',
    'Soup': 'https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?w=800&q=80',
    'Drink': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80',
    'Sandwich': 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&q=80',
    'French Toast': 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&q=80',
    'Bread': 'https://images.unsplash.com/photo-1576458088443-04a19bb13da6?w=800&q=80',
    'Coffee': 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800&q=80',
    'Tea': 'https://images.unsplash.com/photo-1497534547324-0ebb3f052e88?w=800&q=80',
    'Paella': 'https://images.unsplash.com/photo-1549396535-c11d5c55b9df?w=800&q=80',
    'Risotto': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80',
    'Pasta': 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80',
    'Chicken Wings': 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&q=80',
    'Chimichanga': 'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=800&q=80',
    'Ice Cream': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80',
    'Apple Pie': 'https://images.unsplash.com/photo-1505935428862-770b6f24f629?w=800&q=80',
    'Tiramisu': 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80',
    'Water': 'https://images.unsplash.com/photo-1525385133512-2f346b384390?w=800&q=80',
    'Wine': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80',
    'Wings': 'https://images.unsplash.com/photo-1527477396000-64ca9c02d732?w=800&q=80',
    'Beer': 'https://images.unsplash.com/photo-1535958636474-b021ee8874a3?w=800&q=80',
    'Brownie': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476d?w=800&q=80',
    'Bruschetta': 'https://images.unsplash.com/photo-1572695157363-bc31940195e5?w=800&q=80',
    'Calamari': 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&q=80',
    'Coke': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80',
    'Cookie': 'https://images.unsplash.com/photo-1499636136210-6f4ee9179d6d?w=800&q=80',
    'Dumplings': 'https://images.unsplash.com/photo-1541696490-8744a570242e?w=800&q=80',
    'Fish & Chips': 'https://images.unsplash.com/photo-1534938665420-4193effeacc4?w=800&q=80',
    'Fries': 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=800&q=80',
    'Garlic Bread': 'https://images.unsplash.com/photo-1573140247632-f84660f67627?w=800&q=80',
    'Juice': 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800&q=80',
    'Lasagna': 'https://images.unsplash.com/photo-1574868352513-716363c1c1b5?w=800&q=80',
    'Lemonade': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80',
    'Mousse': 'https://images.unsplash.com/photo-1549405664-887714652273?w=800&q=80',
    'Nachos': 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=800&q=80',
    'Pie': 'https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=800&q=80',
    'Pudding': 'https://images.unsplash.com/photo-1517093720242-8e01b6951493?w=800&q=80',
    'Sorbet': 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=800&q=80',
    'Spring Rolls': 'https://images.unsplash.com/photo-1544510802-ac42b6a22b7a?w=800&q=80',
    'Steak': 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80',
    'Tacos': 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80',
    'Tart': 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=800&q=80',
    'Soda': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80',
    'Smoothie': 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=800&q=80',
    'Wrap': 'https://images.unsplash.com/photo-1529006638446-88e5d0337c42?w=800&q=80',
    'Bagel': 'https://images.unsplash.com/photo-1516684732162-79880062f549?w=800&q=80',
    'Waffles': 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=800&q=80',
    'Omelette': 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800&q=80',
    'Milkshake': 'https://images.unsplash.com/photo-1572490122747-3968d0554180?w=800&q=80',
    'Quesadilla': 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=800&q=80',
    'Burrito': 'https://images.unsplash.com/photo-1566740933430-b5e70b06d2d5?w=800&q=80',
    'Enchilada': 'https://images.unsplash.com/photo-1534352956036-c01ac4439d01?w=800&q=80',
    'Pancakes': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab0045?w=800&q=80',
    'Bacon': 'https://images.unsplash.com/photo-1606851682837-147325605d8f?w=800&q=80',
    'Sausage': 'https://images.unsplash.com/photo-1585325701165-351af9ed956f?w=800&q=80'
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80'; // Healthy food fallback

http.get(API_URL, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const response = JSON.parse(data);
            const items = response.data || [];

            let sqlContent = '-- Auto-generated Update Script for Menu Images\n\n';

            items.forEach(item => {
                const name = item.name;
                let imageUrl = DEFAULT_IMAGE;

                // Find matching keyword in item name
                for (const [key, url] of Object.entries(imageMap)) {
                    if (name.toLowerCase().includes(key.toLowerCase())) {
                        imageUrl = url;
                        break;
                    }
                }

                // Escape single quotes in name for SQL
                const safeName = name.replace(/'/g, "''");

                sqlContent += `UPDATE menu_item_photos SET url = '${imageUrl}' WHERE menu_item_id IN (SELECT id FROM menu_items WHERE name = '${safeName}');\n`;
            });

            fs.writeFileSync(OUTPUT_FILE, sqlContent);
            console.log(`Generated SQL for ${items.length} items to ${OUTPUT_FILE}`);

        } catch (e) {
            console.error('Error parsing JSON:', e.message);
        }
    });

}).on('error', (err) => {
    console.error('Error fetching API:', err.message);
});
