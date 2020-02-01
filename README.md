
# sf-downloader
Simple nodejs app that downloads files sequentially when provided starting URL. <br />
Retry functionality up to 3 times if download fails for some file in the sequence. <br />
One second delay between each file. <br />
Files are saved to the `output` directory. <br />

## Usage example
```bash
$ npm start http://example.com/images 2 jpeg
```
Parameters:

Parameter | Description | Default
--- | --- | --- 
`0` | Base URL |  /
`1` | Starting point | 1
`2` | File extension | jpeg


## Support
All suggestions and improvements are welcomed and appreciated.


## License
The [MIT License](https://github.com/seidme/sf-downloader/blob/master/LICENSE).
