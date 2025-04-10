import csv

INPUT_FILE = 'Ideas.csv'
OUTPUT_FILE = 'insert_ideas.sql'

def escape_quotes(text):
    return text.replace("'", "''")

def generate_insert_sql(row):
    name = escape_quotes(row['Name'].strip())
    description = escape_quotes(row['Description'].strip() if row['Description'] else '')
    url = escape_quotes(row['URL'].strip() if row['URL'] else '')
    image = escape_quotes(row['image'].strip() if row['image'] else '')
    price = float(row['Price']) if row['Price'] else 0.0
    rating = float(row['Rating']) if row['Rating'] else 0.0

    return (
        f"INSERT INTO ideas (name, description, url, image, price, rating) "
        f"VALUES ('{name}', '{description}', '{url}', '/uploads/ideas/{image}', {price}, {rating});"
    )

def process_csv(input_path, output_path):
    with open(input_path, newline='', encoding='utf-8') as infile, \
         open(output_path, 'w', encoding='utf-8') as outfile:
        
        reader = csv.DictReader(infile)
        for row in reader:
            try:
                sql = generate_insert_sql(row)
                outfile.write(sql + '\n')
            except Exception as e:
                print(f"Skipping row due to error: {e}")

if __name__ == '__main__':
    process_csv(INPUT_FILE, OUTPUT_FILE)
    print(f"SQL insert statements written to {OUTPUT_FILE}")
