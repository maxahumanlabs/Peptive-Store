import json
import random
from datetime import datetime, timedelta

# File paths
peptive_path = '/Users/Seif/Documents/Maxa Human/peptive-master/public/data/static-reviews.json'
maxa_path = '/Users/Seif/Documents/Maxa Human/Maxa Human/public/data/static-reviews.json'

with open(peptive_path, 'r', encoding='utf-8') as f:
    reviews = json.load(f)

# Remove all existing reviews with images
reviews = [r for r in reviews if not r.get('images')]

# Define the new 11 reviews
new_reviews_data = [
    {"name": "Salem Al-Marri", "text": "الكواليتي فوق الممتاز، جربت شركات كتير بس دي الأفضل من ناحية النقاء والتغليف. التوصيل كان سريع جداً."},
    {"name": "Majed", "text": "الصراحة نتيجة مبهرة من أول أسبوعين، والميزة إن الدعم الفني متجاوبين وبيشرحوا كل تفصيلة بوضوح. أنصح فيه."},
    {"name": "Khalifa", "text": "الباكينج احترافي ومبين إنهم مهتمين بكل التفاصيل. الجودة ممتازة والنتيجة فرقت معايا جداً في الاستشفاء."},
    {"name": "Saeed M.", "text": "ما قصروا والله، العبوات وصلت سليمة ومعقمة ومفعولها واضح من أول استخدام. أكيد بستمر معاهم."},
    {"name": "Fahad", "text": "الشفافية في تقارير الفحص بتخلي الواحد يطلب وهو مطمن. النتايج خرافية وتستاهل ثقتنا."},
    {"name": "Abdullah", "text": "تجربتي معاهم ممتازة، المنتجات جودتها عالية جداً ونومتي صارت أعمق والريكفري أسرع بعد التمرين."},
    {"name": "Marcus T.", "text": "Absolutely top-tier quality. The packaging was secure, and the results have been consistent."},
    {"name": "David W.", "text": "I've noticed a significant improvement in my recovery times since I started using this. Customer service is also incredibly helpful."},
    {"name": "John", "text": "Lab tests being publicly available is a huge plus. You know exactly what you're getting, and the purity is noticeable."},
    {"name": "Alex R.", "text": "Arrived earlier than expected. The vials are sturdy and the product mixed perfectly without any cloudiness."},
    {"name": "Michael S.", "text": "Great product overall. The difference in my sleep quality and joint health has been phenomenal over the past month."}
]

new_reviews = []
base_id = 2000
for i, data in enumerate(new_reviews_data):
    # Generate random date within last 6 months
    days_ago = random.randint(2, 180)
    date_obj = datetime.now() - timedelta(days=days_ago)
    date_str = f"{date_obj.day}/{date_obj.month}/{date_obj.year}"
    
    new_reviews.append({
        "id": base_id + i,
        "name": data["name"],
        "date": date_str,
        "rating": 5,
        "text": data["text"],
        "verified": True,
        "images": [f"/Reviews/{i+1}.jpeg"]
    })

# Shuffle the new reviews so English and Arabic are mixed
random.shuffle(new_reviews)

# Prepend new reviews to the list
reviews = new_reviews + reviews

# Save back to both repos
with open(peptive_path, 'w', encoding='utf-8') as f:
    json.dump(reviews, f, indent=2, ensure_ascii=False)

with open(maxa_path, 'w', encoding='utf-8') as f:
    json.dump(reviews, f, indent=2, ensure_ascii=False)

print("Generated and inserted 11 new image reviews successfully.")
