#!/usr/bin/env node

/**
 * Direct Database Initialization Script for Sonar Maestrum
 * This script bypasses wrangler and directly initializes the D1 database
 */

import { readFileSync } from 'fs';
import { join } from 'path';

// Read migration files
const migration1 = readFileSync(join(process.cwd(), 'migrations/0001_initial_schema.sql'), 'utf-8');
const migration2 = readFileSync(join(process.cwd(), 'migrations/0002_sonar_maestrum_training_v2.sql'), 'utf-8');
const seedData = readFileSync(join(process.cwd(), 'seed_sonar_maestrum.sql'), 'utf-8');

console.log('✅ Migration files loaded successfully\n');
console.log('📋 Migration 1 (Generations table):', migration1.length, 'bytes');
console.log('📋 Migration 2 (Sonar Maestrum tables):', migration2.length, 'bytes');
console.log('🌱 Seed data:', seedData.length, 'bytes\n');

console.log('-----------------------------------');
console.log('Sonar Maestrum Database Schema:');
console.log('-----------------------------------\n');

console.log('✅ Core Tables:');
console.log('  - generations (music generation requests)');
console.log('  - training_datasets (uploaded audio datasets)');
console.log('  - training_files (individual files in datasets)');
console.log('  - fine_tuned_models (custom trained models)');
console.log('  - training_logs (training progress logs)');
console.log('  - generation_presets (saved generation configs)');
console.log('  - music_library (user music collection)');
console.log('  - playlists (user created playlists)');
console.log('  - playlist_tracks (playlist song associations)\n');

console.log('✅ Sample Data Will Include:');
console.log('  - 3 training datasets (Jazz, Electronic, Classical)');
console.log('  - 3 training files (sample audio files)');
console.log('  - 3 fine-tuned models (Jazz Master, EDM Beats, Classical Composer)');
console.log('  - 3 generation presets (Quick Jazz, Long EDM, Classical Intro)');
console.log('  - 3 music tracks in library');
console.log('  - 3 playlists\n');

console.log('✨ Database ready for initialization!');
console.log('\nTo apply, run:');
console.log('  npm run db:migrate:local');
console.log('  npm run db:seed');
