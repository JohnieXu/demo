#!/bin/bash
# 请写一个 bash 脚本，自动执行./build.sh脚本，如果成功则继续执行./server.sh脚本，两个脚本都执行成功就告诉我成功

# 执行 build.sh 脚本
./build.sh

# 检查 build.sh 执行结果
if [ $? -eq 0 ]; then
  # 执行 server.sh 脚本
  ./server.sh

  # 检查 server.sh 执行结果
  # if [ $? -eq 0 ]; then
  #   echo "成功"
  # else
  #   echo "server.sh 脚本执行失败"
  # fi
else
  echo "build.sh 脚本执行失败"
fi
