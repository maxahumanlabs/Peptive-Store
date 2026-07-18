import json

with open('/Users/Seif/Documents/Maxa Human/Maxa Human/public/data/static-reviews.json', 'r', encoding='utf-8') as f:
    reviews = json.load(f)

# Define Khaleeji translations
khaleeji_translations = [
    "الصراحة كنت متردد في البداية، بس النتايج في الشهر اللي فات كانت واضحة جداً. أنصح فيه بقوة لأي حد مهتم بروتينه اليومي.",
    "كل حاجة وصلت معقمة وتغليفها ممتاز. وخدمة العملاء كانوا سريعين جداً في الرد على استفساراتي، ما قصروا والله.",
    "شي يفرّح إنك تلاقي شركة فعلاً بتقدم اللي بتوعد بيه. أكيد بطلب منهم مرة تانية.",
    "فرق ملحوظ في حركة المفاصل بعد كام أسبوع. راضي جداً عن النتيجة، تسلم إيديكم.",
    "ما عندي أي شكوى أبداً. الطلبية وصلت بسرعة والجودة بالظبط زي ما هو مكتوب، يعطيكم العافية.",
    "نومتي صارت أهدأ وأريح، وفرق معايا جداً لما استمريت عليه. جودة العبوات والتغليف ممتازة وتستاهل الثقة.",
    "التغيير الأكبر بالنسبة لي كان في الاستشفاء بعد التمارين القوية. الكواليتي خيالي صراحة.",
    "أكتر شي عجبني تفاصيل تقارير الفحص المخبري، هالشي يعطيك ثقة كبيرة. المنتج شغال بالظبط زي ما توقعت.",
    "العلب متينة وجودتها عالية، حتى التفاصيل الصغيرة مهتمين فيها صح.",
    "تغيير جذري في روتيني اليومي. الجودة أحسن بمراحل من ماركات تانية جربتها قبل كده."
]

# Apply to a mix of image and non-image reviews
img_count = 0
non_img_count = 0

for r in reviews:
    has_images = 'images' in r and len(r['images']) > 0
    if has_images and img_count < 3:
        r['text'] = khaleeji_translations[img_count]
        img_count += 1
    elif not has_images and non_img_count < 7:
        r['text'] = khaleeji_translations[img_count + non_img_count]
        non_img_count += 1

# Save back to both repos
with open('/Users/Seif/Documents/Maxa Human/Maxa Human/public/data/static-reviews.json', 'w', encoding='utf-8') as f:
    json.dump(reviews, f, indent=2, ensure_ascii=False)

with open('/Users/Seif/Documents/Maxa Human/peptive-master/public/data/static-reviews.json', 'w', encoding='utf-8') as f:
    json.dump(reviews, f, indent=2, ensure_ascii=False)

print("Reviews translated successfully.")
