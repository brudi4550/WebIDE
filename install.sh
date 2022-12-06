#!/bin/bash
npm i
cd src/client && npm i
cd ../server
touch .env && echo 'PORT=3001' > .env
cd ../..

JDK_INSTALLED=true
which -s java
if [ $? != 0 ]; then
    JDK_INSTALLED=false
fi

PYTHON_INSTALLED=true
which -s python3
if [ $? != 0 ]; then
    PYTHON_INSTALLED=false
fi

GCC_INSTALLED=true
which -s gcc
if [ $? != 0 ]; then
    GCC_INSTALLED=false
fi

RUST_INSTALLED=true
which -s rustc
if [ $? != 0 ]; then
    RUST_INSTALLED=false
fi

GO_INSTALLED=true
which -s go
if [ $? != 0 ]; then
    GO_INSTALLED=false
fi

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    sudo apt-get update
    sudo apt-get upgrade
    if [ "$JDK_INSTALLED" = false ]; then
        echo 'JDK not installed, installing now.'
        sudo apt-get install default-jdk
    fi

    if [ "$PYTHON_INSTALLED" = false ]; then
        echo 'Python not installed, installing now.'
        sudo apt-get install python3
    fi

    if [ "$GCC_INSTALLED" = false ]; then
        echo 'GCC not installed, installing now.'
        sudo apt install build-essential
    fi

    if [ "$RUST_INSTALLED" = false ]; then
        echo 'Rust not installed, installing now.'
        sudo apt install build-essential
        curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    fi

    if [ "$GO_INSTALLED" = false ]; then
        echo 'GO not installed, installing now.'
        sudo rm -rf /usr/local/go && sudo tar -C /usr/local -xzf go1.19.3.linux-amd64.tar.gz
        #add to $HOME/.profile: export PATH=$PATH:/usr/local/go/bin
    fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
    which -s brew
    if [[ $? != 0 ]]; then
        echo "Homebrew not installed. Installing now."
        ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    else
        brew update
    fi
    if [ "$JDK_INSTALLED" = false ]; then
        echo 'JDK not installed, installing now.'
        brew install openjdk
    fi

    if [ "$PYTHON_INSTALLED" = false ]; then
        echo 'Python not installed, installing now.'
        brew install python
    fi

    if [ "$GCC_INSTALLED" = false ]; then
        echo 'GCC not installed, installing now.'
        brew install gcc
    fi

    if [ "$RUST_INSTALLED" = false ]; then
        echo 'Rust not installed, installing now.'
        curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    fi

    if [ "$GCC_INSTALLED" = false ]; then
        echo 'Go not installed, installing now.'
        brew install go
    fi
fi
