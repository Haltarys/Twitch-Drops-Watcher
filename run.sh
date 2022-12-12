#!/bin/bash

# Build if image does not exist
if [[ "$(sudo docker images -q twitch-drops-watcher 2> /dev/null)" == "" ]]; then
  sudo docker build -t twitch-drops-watcher .
fi

# Run and log results
logfile="$HOME/twitch-drops-watcher.log"
gamenames=("Mortal Shell" "Mortal Shell: Enhanced Edition") # Or whatever games you prefer

echo $(date) >> $logfile
(sudo docker run --rm twitch-drops-watcher $gamenames --drops 2>&1) >> $logfile
echo >> $logfile
