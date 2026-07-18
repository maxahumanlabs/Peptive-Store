import re

with open('app/page.tsx', 'r') as f:
    content = f.read()

with open('/tmp/hero_section.tsx', 'r') as f:
    new_hero = f.read()

# Make sure new_hero doesn't contain extra stuff at the end
# The new_hero should end with </section>
new_hero = new_hero.strip()

# Find the old hero section
start_marker = "{/* Hero Section */}"
start_idx = content.find(start_marker)

# Find the first </section> after the start marker
end_idx = content.find("</section>", start_idx) + len("</section>")

# Replace
new_content = content[:start_idx] + new_hero + content[end_idx:]

with open('app/page.tsx', 'w') as f:
    f.write(new_content)
