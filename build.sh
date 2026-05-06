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

# Function to validate blog data <-> markdown file consistency
validate_blogs() {
  echo "** Validating content data..."
  node scripts/validate-blogs.js
}

# Function to fan out paginated JSON pages from JSONL sources
build_data_pages() {
  echo "** Building data pages..."
  node scripts/build-data-pages.js
}

# Function to generate routes.txt from base routes + content
build_routes() {
  echo "** Building routes.txt..."
  node scripts/build-routes.js
}

# Function to generate src/sitemap.xml from base sitemap + content
build_sitemap() {
  echo "** Building sitemap.xml..."
  node scripts/build-sitemap.js
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
     validate_blogs && \
     build_data_pages && \
     build_routes && \
     build_sitemap && \
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
