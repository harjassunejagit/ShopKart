import sqlite3

conn = sqlite3.connect("shopkart.db")
cursor = conn.cursor()

cursor.execute("""
SELECT name, COUNT(*)
FROM products
GROUP BY name
HAVING COUNT(*) > 1
""")

rows = cursor.fetchall()

if rows:
    print("Duplicate products found:")
    for row in rows:
        print(row)
else:
    print("No duplicate products found")

conn.close()