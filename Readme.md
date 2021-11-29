
# 2021-2 오픈소스 텀프로젝트

## 웹 오목대전 서비스

* 사이트에 접속한 유저들이 로그인 과정을 거치고 서로 오목대전을 즐길 수 있도록 제공하는 서비스

Built With

- Client
    * html canvas로 그래픽표현
- Server & DB
    * [Node.js](https://nodejs.org/ko/download/)
    * [sqlite3](https://www.sqlite.org/index.html)

## Getting Started 

### Prerequisites
* nodejs 설치 [Node.js](https://nodejs.org/ko/download/)

### Installation
* `git clone` 명령으로 프로젝트 폴더 clone
  ```
  git clone http://khuhub.khu.ac.kr/2018102213/WebGomokuService.git
  ```

* `npm install` 명령으로 npm 패키지 설치
  ```
  npm install
  ```

###  Google OAuth Client ID, Client Secret creation
*  다음 블로그글에서 안내하는대로 OAuth Client ID, ClientSecret생성, call back url은 
   ``
  http://localhost:3000/auth/google/callback
  ``
  로 설정 
https://www.a-mean-blog.com/ko/blog/%EB%8B%A8%ED%8E%B8%EA%B0%95%EC%A2%8C/_/Node-JS-%EC%84%9C%EB%B2%84%EC%97%90-%EA%B5%AC%EA%B8%80-%EC%86%8C%EC%85%9C-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EA%B8%B0%EB%8A%A5-%EB%84%A3%EA%B8%B0-1-2-Google-OAuth-Client-ID-Client-Secret-%EC%83%9D%EC%84%B1%EB%B0%A9%EB%B2%95

* Google OAuth client ID를 GOOGLE_CLIENT_ID, secret을 GOOGLE_SECRET로 환경 변수에 저장 or
config/passport.js의 process.env.GOOGLE_CLIENT_ID,process.env.GOOGLE_SECRET을 생성한 OAuth CLient ID, ClientSecret으로 각각 대체하여 작성 후 저장 
###  Run
*  main.js파일을 node.js로 실행
```
  node main.js
  ```
## Usage


## Roadmap 

## Contribution

## License
## Contact

2018102213 윤태웅 15ywt@khu.ac.kr

프로젝트 주소 : http://khuhub.khu.ac.kr/2018102213/WebGomokuService