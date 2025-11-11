#!/usr/bin/env node

/**
 * Validates that ADMIN_TRAINING_MANUAL.md exists and is readable
 * This script runs during build to ensure the manual is always up-to-date
 */

const { readFileSync, existsSync } = require('fs');
const { join } = require('path');

const manualPath = join(process.cwd(), 'ADMIN_TRAINING_MANUAL.md');

console.log('🔍 Validating training manual...');
console.log('📄 Path:', manualPath);

// Check if file exists
if (!existsSync(manualPath)) {
  console.error('❌ ERROR: ADMIN_TRAINING_MANUAL.md not found!');
  console.error('   The training manual file is required for deployment.');
  console.error('   Please ensure the file exists in the project root.');
  process.exit(1);
}

// Try to read the file
try {
  const content = readFileSync(manualPath, 'utf-8');
  
  if (!content || content.trim().length === 0) {
    console.error('❌ ERROR: ADMIN_TRAINING_MANUAL.md is empty!');
    process.exit(1);
  }

  // Check for minimum content (at least a title)
  if (content.length < 100) {
    console.warn('⚠️  WARNING: Training manual seems very short. Is it complete?');
  }

  // Check for basic markdown structure
  if (!content.includes('#') && !content.includes('##')) {
    console.warn('⚠️  WARNING: Training manual may not have proper headings.');
  }

  const lineCount = content.split('\n').length;
  console.log('✅ Training manual validated successfully!');
  console.log(`   Size: ${(content.length / 1024).toFixed(2)} KB`);
  console.log(`   Lines: ${lineCount}`);
  console.log('   File is ready for deployment.');
  
} catch (error) {
  console.error('❌ ERROR: Failed to read training manual file!');
  console.error('   Error:', error.message);
  process.exit(1);
}

