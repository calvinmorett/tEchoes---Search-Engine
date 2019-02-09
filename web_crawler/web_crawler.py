from multiprocessing.pool import ThreadPool
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import requests
import sqlite3

sql_create_table = """CREATE TABLE IF NOT EXISTS WEB (
                                title text,
                                url text NOT NULL UNIQUE
                            );"""

sql_insert_data = """INSERT OR IGNORE INTO WEB(title, url) VALUES(?,?)"""


def scrawl_website(start_url):
    counter = 0

    links_list = [start_url]  # list with links to be scrawled

    print(start_url)
    conn = sqlite3.connect('db' + str(urls.index(start_url)) + '.db')
    c = conn.cursor()
    c.execute(sql_create_table)

    while counter < len(links_list) and counter < websites_to_search:
        web(links_list[counter], links_list, start_url, c)
        counter += 1
        print(str(urls.index(start_url)) + '---' + str(counter))

    conn.commit()


def web(web_url, links_list, start_url, c):
    url = web_url
    code = requests.get(url)
    plain = code.text
    # print(plain)
    s = BeautifulSoup(plain, "html.parser")

    for link in s.findAll('a'):
        if link.get('title'):
            my_title = link.get('title')
        else:
            my_title = link.text
        temp_link = link.get('href')
        my_link = str(urljoin(web_url, temp_link))

        # link is not null, is not the start link and doesn't contains special chars that redirect to the same
        if my_link and (start_url != my_link) and (start_url in my_link) and (
                "&" not in my_link) and ("#" not in my_link) and (
                    "php" not in my_link):
            links_list.append(my_link)
            c.execute(sql_insert_data,
                      (my_title, my_link))
            # print(str(my_title) + " " + str(my_link))


websites_to_search = 500

urls = [
    'https://en.wikipedia.org', 'https://www.wikihow.com',
    'https://www.encyclopedia.com', 'https://answers.yahoo.com'
]

# make the Pool of workers
pool = ThreadPool(len(urls))

# open the urls in their own threads
# and return the results
results = pool.map(scrawl_website, urls)

# close the pool and wait for the work to finish
pool.close()
pool.join()
