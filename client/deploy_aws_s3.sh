grunt build && cd ./dist
aws s3 rm s3://3kduanzi.com/ --recursive  --region ap-northeast-1
aws s3 cp . s3://3kduanzi.com/ --recursive --region ap-northeast-1 --acl public-read