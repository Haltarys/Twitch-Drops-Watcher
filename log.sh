#!/bin/bash -l

# Run and log results
logfile="$HOME/twitch-drops-watcher.log"
envfile="$HOME/twitch-drops-watcher.env"
defaults=("Mortal Shell" "Mortal Shell: Enhanced Edition") # Default values
games=("${@:-"${defaults[@]}"}")

date >> $logfile
(npx twitch-drops-watcher "${games[@]}" --drops --env $envfile 2>&1) >> $logfile
echo >> $logfile
