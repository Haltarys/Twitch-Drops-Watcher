#!/bin/bash

# # Build if image does not exist
if [[ "$(docker images -q twitch-drops-watcher 2> /dev/null)" == "" ]]; then
  docker build -t twitch-drops-watcher .
fi

# # Run and log results
logfile="$HOME/twitch-drops-watcher.log"

echo $(date) >> $logfile
(docker run --rm twitch-drops-watcher "Mortal Shell" "Mortal Shell: Enhanced Edition" --drops 2>&1) >> $logfile
echo >> $logfile
