from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.request import urlretrieve
import json

root = Path(__file__).parent / 'public' / 'images'
# Public Unsplash photographs, selected to preserve the reference's visual roles.
series = {
 'garden': ['1600099867377-ee300986ffac','1692559002785-a29655c90022','1548382131-e0ebb1f0cdea'],
 'wedding': ['1617202000199-15fab1b09935','1632687044991-36ac5d4ac68f','1667945782367-4458a9a8cc27','1674232636722-e346adc6d678','1705088014790-2ee51194bd0a'],
 'beauty': ['1560042772-af14ca553284','1661264265504-86515673af19','1560505841-4a36bd2cbdd4','1599430078313-4b58d033094e','1566752670781-61f57d5c7ec4','1634477576605-0c973ae58719'],
 'mono': ['1663550910287-0c92a030feab','1548382131-e0ebb1f0cdea','1663550910374-a9c0a9f8b455','1742402372285-da4752ec3533','1652471943570-f3590a4e52ed','1729795795388-2d07bfb2d791'],
 'scents': ['1680503504148-25f2d178ff05','1636730431099-20607b24ded9','1617777704017-bd413c7be892','1617943422341-6ae140cc1c85','1617943539287-d6fe110ac7ad','1735382509872-aeed378a7ea9'],
 'waters': ['1536861028716-5e0d30fe7387','1626211353112-1d0f0d1c6aaa','1500416149159-461f35b7e5da','1641598091363-29c98f623b64','1626211351657-b806c275776f','1536861028716-5e0d30fe7387'],
}
series['covers'] = [series[g][0] for g in ['garden','wedding','beauty','mono','scents','waters']]
series['about'] = [series['garden'][0],series['beauty'][1],series['mono'][0],series['mono'][4],series['mono'][1],series['mono'][5],series['mono'][2],series['mono'][4]]
series['services'] = [series['mono'][2],series['wedding'][1],'1659928005804-0ec9c656918f',series['beauty'][4],series['scents'][1],'1574154883606-19fa4f836c54',series['scents'][2]]
series['garden'] = series['garden'] * 2

manifest_path = root.parent/'image-credits.json'
previous = {i['file']:i['source'] for i in json.loads(manifest_path.read_text())} if manifest_path.exists() else {}

def download(item):
    group, index, photo = item
    path = root / f'{group}-{index}.jpg'
    url = f'https://images.unsplash.com/photo-{photo}?auto=format&fit=max&w=1600&q=85&fm=jpg'
    if not path.exists() or previous.get(path.name) != url:
        urlretrieve(url, path)
    if path.stat().st_size < 2000:
        raise ValueError(f'Invalid image: {path}')
    return {'file':path.name, 'source':url, 'provider':'Unsplash', 'license':'https://unsplash.com/license'}

if __name__ == '__main__':
    jobs = [(group,i,photo) for group,photos in series.items() for i,photo in enumerate(photos)]
    with ThreadPoolExecutor(max_workers=8) as pool:
        manifest = list(pool.map(download,jobs))
    (root.parent/'image-credits.json').write_text(json.dumps(manifest,indent=2))
    print(f'Downloaded and verified {len(manifest)} replacement photographs.')
