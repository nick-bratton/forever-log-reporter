to verify that mongo is running locally: 
# ps aux | grep -v grep | grep mongod

to view the log file and see the current status of the daemon:
# cd /usr/local/var/log/mongodb
# nano mongo.log

what was the stack like where this is run?
-ubuntu / mongo / node / node_modules
-should we containerize this?

https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/

this including susi requires you to be able to watch more files. on ubuntu: 

# echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p