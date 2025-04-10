import csv

INPUT_FILE = 'Ideas.csv'
OUTPUT_FILE = 'insert_ideas_categories.sql'

# Function to generate SQL statements for idea_categories
def generate_sql():
    idea_categories_sql = []
    
    # Open CSV file and read the rows
    with open(INPUT_FILE, 'r') as file:
        reader = csv.DictReader(file)
        
        # Generate SQL for idea_categories
        for row_num, row in enumerate(reader, 1):  # Row number will be the idea_id
            idea_id = row_num  # Idea ID is the row number
            categories = row['Categories[]'].split(',')
            
            for category in categories:
                category_name = category.strip() 
                # Create the INSERT statement for the idea_categories relationship
                idea_categories_sql.append(f"INSERT INTO idea_categories (idea_id, category_id) SELECT {row_num},c.id FROM categories c WHERE c.name = '{category_name}';")
    
    # Write SQL statements to a .sql file
    with open(OUTPUT_FILE, 'w') as output_file:
        # Write the idea_categories insertion statements
        output_file.write("-- Insert Idea Categories\n")
        for stmt in idea_categories_sql:
            output_file.write(stmt + "\n")

    print(f"SQL file '{OUTPUT_FILE}' has been generated.")

# Generate the SQL file
generate_sql()
