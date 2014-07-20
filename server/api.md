basic context: **/api**
#### create duanzi ####
```
    url: /duanzi
    method: post
    request body: { "author":"author name" , "duanzis":[{"body":"body1"},{"body":"body2"}]}
    response ok : 201: { message :"created"}
    response bad: 500: {message : "unknown error"}
```

