#!/bin/sh

# Function to register git hooks
register_git_hooks() {
  echo "** Registering git hooks..."
  ./register-git-hooks.sh
}

# Function to check code format with prettier
check_code_format() {
  echo "** Running prettier check..."
  npx prettier . --check --ignore-unknown
}

# Function to build the node project
build_project() {
  echo "** Building project..."
  ng build
}

# Main function to orchestrate the steps
main() {
  if register_git_hooks && \
     check_code_format && \
     build_project; then
    echo "Build Succeeded"
    exit 0
  else
    echo "Build Failed"
    exit 255
  fi
}

# Execute the main function
main
