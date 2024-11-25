import mysql.connector
from mysql.connector import errorcode, MySQLConnection

try:
    db_connection = MySQLConnection(user="jpa", password="password", host="localhost", port="3306", database="jwt")
    print("DB Connected")
except mysql.connector.Error as error:
    if error.errno == errorcode.ER_BAD_DB_ERROR:
        print("Database doesn't exist")
    elif error.errno == errorcode.ER_ACCESS_DENIED_ERROR:
        print("User name or password is wrong")
    else:
        print(error)

cursor = db_connection.cursor()

print("Populate roles.")
roles = ["admin", "developer", "tester", "pm", "ba", "ta"]
for role in roles:
    sql = """INSERT IGNORE INTO roles(role) VALUES ('%s')""" % (role)
    cursor.execute(sql)

print("Populate root account.")
sql = "INSERT IGNORE INTO users(username, password, account_non_locked, enabled) VALUES ('root', '$2a$10$duyDJPL5hTnsqf4DN./3F.6Ga3qjXuwQA0/TBAASrpl5zONnaTNcy', true, true)"
cursor.execute(sql)

print("Assign 'admin' role to 'root' account.")
sql = "INSERT IGNORE INTO users_roles(username, role) VALUES ('root', 'admin')"
cursor.execute(sql)

db_connection.commit()
db_connection.close()
