myDate=`date`
echo $myDate
curl -H "Content-Type: application/json" -H "X-Auth-User: 1234" -X POST -d '{"date":"'"$myDate"'"}' http://localhost:8080/api/gifs/favorite 
curl -H "Content-Type: application/json" -H "X-Auth-User: 1233" -X POST -d '{"date":"'"$myDate"'"}' http://localhost:8080/api/emojis/favorite 
curl -H "Content-Type: application/json" -H "X-Auth-User: 2234" -X POST -d '{"date":"'"$myDate"'"}' http://localhost:8080/api/gifs/favorite 
curl -H "Content-Type: application/json" -H "X-Auth-User: 6562" -X POST -d '{"date":"'"$myDate"'"}' http://localhost:8080/api/emojis/favorite 
