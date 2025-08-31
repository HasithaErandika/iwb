import requests
from bs4 import BeautifulSoup

def fetch_latest_news(n=5):
    url = "https://www.newswire.lk/"
    response = requests.get(url)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")

    items = soup.select("div.posts-list-widget div.posts-listunit")

    news_items = []
    for item in items[:n]:
        title_tag = item.select_one("h4.posts-listunit-title a")
        title = title_tag.get_text(strip=True) if title_tag else "No title"
        link = title_tag["href"] if title_tag else "No link"
        date_tag = item.select_one("time.entry-published")
        date = date_tag.get_text(strip=True) if date_tag else "No date"

        news_items.append({"title": title, "date": date, "link": link})
    return news_items

if __name__ == "__main__":
    latest = fetch_latest_news(5)
    for idx, entry in enumerate(latest, 1):
        print(f"{idx}. {entry['title']} — {entry['date']}\n   {entry['link']}")
