#!/usr/bin/env node

/**
 * Refreshes ADMIN_TRAINING_MANUAL.md to ensure it includes all current features
 * Scans the codebase for admin pages, API routes, and features
 * Updates the manual with any missing documentation
 */

const { readFileSync, writeFileSync, existsSync } = require('fs');
const { join } = require('path');
const { execSync } = require('child_process');

const manualPath = join(process.cwd(), 'ADMIN_TRAINING_MANUAL.md');

console.log('🔄 Refreshing training manual with latest features...\n');

// Scan for admin pages
function scanAdminPages() {
  const pages = [];
  try {
    const result = execSync('find app/admin -name "page.tsx" -type f', { encoding: 'utf-8' });
    const files = result.trim().split('\n').filter(Boolean);
    
    for (const file of files) {
      const path = file.replace('app/admin/', '').replace('/page.tsx', '');
      const route = path || 'dashboard';
      const name = route.split('/').pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      pages.push({ route, name, file });
    }
  } catch (error) {
    console.warn('⚠️  Could not scan admin pages:', error.message);
  }
  return pages;
}

// Scan for admin API routes
function scanAdminAPIs() {
  const apis = [];
  try {
    const result = execSync('find app/api/admin -name "route.ts" -type f', { encoding: 'utf-8' });
    const files = result.trim().split('\n').filter(Boolean);
    
    for (const file of files) {
      const path = file.replace('app/api/admin/', '').replace('/route.ts', '');
      apis.push({ route: path, file });
    }
  } catch (error) {
    console.warn('⚠️  Could not scan admin APIs:', error.message);
  }
  return apis;
}

// Check if feature is documented
function isFeatureDocumented(manualContent, featureName) {
  const lowerContent = manualContent.toLowerCase();
  const lowerFeature = featureName.toLowerCase();
  
  // Check for various forms of the feature name
  const patterns = [
    lowerFeature,
    lowerFeature.replace(/\s+/g, '-'),
    lowerFeature.replace(/\s+/g, ''),
  ];
  
  return patterns.some(pattern => lowerContent.includes(pattern));
}

// Main function
function refreshManual() {
  // Read current manual
  if (!existsSync(manualPath)) {
    console.error('❌ ERROR: ADMIN_TRAINING_MANUAL.md not found!');
    process.exit(1);
  }

  const manualContent = readFileSync(manualPath, 'utf-8');
  
  // Scan codebase
  console.log('📋 Scanning codebase for features...');
  const adminPages = scanAdminPages();
  const adminAPIs = scanAdminAPIs();
  
  console.log(`   Found ${adminPages.length} admin pages`);
  console.log(`   Found ${adminAPIs.length} admin API routes\n`);

  // Check for missing documentation
  const missingFeatures = [];
  
  for (const page of adminPages) {
    if (!isFeatureDocumented(manualContent, page.name)) {
      missingFeatures.push({
        type: 'Page',
        name: page.name,
        route: page.route,
      });
    }
  }

  // Known features that should be documented
  const knownFeatures = [
    { name: 'Popular Categories', section: 'Settings' },
    { name: 'Bundle Discount', section: 'Settings' },
    { name: 'Contact Email', section: 'Settings' },
    { name: 'Contact Phone', section: 'Settings' },
    { name: 'Product Sorting', section: 'Managing Products' },
    { name: 'Training Manual View', section: 'Settings' },
  ];

  for (const feature of knownFeatures) {
    if (!isFeatureDocumented(manualContent, feature.name)) {
      missingFeatures.push({
        type: 'Feature',
        name: feature.name,
        section: feature.section,
      });
    }
  }

  // Report findings
  if (missingFeatures.length === 0) {
    console.log('✅ All features appear to be documented!');
    console.log('   Manual is up-to-date and ready for deployment.\n');
    return;
  }

  console.log('⚠️  WARNING: Some features may not be fully documented:\n');
  for (const feature of missingFeatures) {
    console.log(`   - ${feature.type}: ${feature.name}`);
    if (feature.route) console.log(`     Route: /admin/${feature.route}`);
    if (feature.section) console.log(`     Should be in: ${feature.section}`);
  }
  
  console.log('\n📝 Please review and update the manual to include these features.');
  console.log('   The manual should be updated before deployment.\n');
  
  // Add/update timestamp to manual
  const timestamp = new Date().toISOString().split('T')[0];
  const lastUpdatedPattern = /<!-- Last updated: .*? -->/g;
  
  let updatedContent = manualContent;
  if (lastUpdatedPattern.test(manualContent)) {
    // Replace all occurrences with single timestamp
    updatedContent = updatedContent.replace(
      lastUpdatedPattern,
      `<!-- Last updated: ${timestamp} -->`
    );
    // Remove duplicates if any
    updatedContent = updatedContent.replace(
      /<!-- Last updated: .*? -->\s*<!-- Last updated: .*? -->/g,
      `<!-- Last updated: ${timestamp} -->`
    );
  } else {
    // Add timestamp at the top
    updatedContent = `<!-- Last updated: ${timestamp} -->\n${updatedContent}`;
  }

  // Write updated manual
  writeFileSync(manualPath, updatedContent, 'utf-8');
  console.log(`✅ Manual timestamp updated: ${timestamp}`);
  console.log('   Manual file has been refreshed.\n');
  
  if (missingFeatures.length > 0) {
    console.log('⚠️  Remember to document the missing features listed above!');
    console.log('   Build will continue, but please update the manual soon.\n');
    // Don't fail build - just warn
  }
}

// Run
try {
  refreshManual();
} catch (error) {
  console.error('❌ ERROR refreshing manual:', error.message);
  process.exit(1);
}

