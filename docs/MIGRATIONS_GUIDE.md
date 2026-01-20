# Database Migrations Guide

## Overview

This project uses Sequelize for database migrations. All models are already defined and the database schema will be automatically synced using Sequelize's `sync` method in development.

For production, you should use migrations to manage schema changes.

---

## Automatic Database Sync (Current Implementation)

**File:** `src/config/database.js`

The current implementation uses Sequelize's `sync()` method to automatically create tables:

```javascript
// Sync models in development
if (config.NODE_ENV === 'development') {
  await sequelize.sync({ alter: false }); // Set to true for auto-migration in dev
}
```

**Note:** This is suitable for development but should NOT be used in production.

---

## All Models That Need Tables

The following models require database tables:

### 1. Authentication & RBAC
- ✅ `users` - User accounts
- `roles` - RBAC roles
- `permissions` - RBAC permissions
- `user_roles` - User-Role pivot table
- `role_permissions` - Role-Permission pivot table
- `sessions` - JWT refresh tokens

### 2. Courses & Content
- ✅ `products` - Products (courses)
- ✅ `courses` - Course details
- ✅ `course_categories` - Course categories
- ✅ `course_instructors` - Course-Instructor pivot table
- ✅ `chapters` - Course chapters
- ✅ `lessons` - Course lessons
- ✅ `quizzes` - Lesson quizzes
- ✅ `questions` - Quiz questions
- ✅ `answers` - Question answers
- ✅ `instructors` - Instructor profiles

### 3. Enrollment & Progress
- ✅ `enrollments` - Course enrollments
- ✅ `lesson_progress` - Lesson completion tracking
- ✅ `quiz_attempts` - Quiz attempt records
- ✅ `certificates` - Course completion certificates

### 4. Commerce
- ✅ `orders` - Purchase orders
- ✅ `order_items` - Order line items
- ✅ `payments` - Payment transactions
- ✅ `refunds` - Refund records
- ✅ `subscriptions` - Subscription plans
- ✅ `coupons` - Discount coupons

### 5. Logging
- ✅ `activity_logs` - User activity logs
- ✅ `admin_action_logs` - Admin action audit trail
- ✅ `email_logs` - Email sending logs
- ✅ `webhook_logs` - Webhook event logs

---

## Creating Migrations Manually

For production deployments, you should create Sequelize migration files. Here's the structure:

### Example Migration File

```javascript
/**
 * Migration: Create orders table
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      productId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      courseId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'courses',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      currency: {
        type: Sequelize.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed', 'cancelled', 'refunded'),
        allowNull: false,
        defaultValue: 'pending',
      },
      paymentMethod: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      paymentId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      transactionId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Add indexes
    await queryInterface.addIndex('orders', ['userId']);
    await queryInterface.addIndex('orders', ['productId']);
    await queryInterface.addIndex('orders', ['courseId']);
    await queryInterface.addIndex('orders', ['status']);
    await queryInterface.addIndex('orders', ['createdAt']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('orders');
  },
};
```

---

## Running Migrations

### Using Sequelize CLI

1. **Install Sequelize CLI:**
```bash
npm install -g sequelize-cli
```

2. **Create migration:**
```bash
npx sequelize-cli migration:generate --name create_orders_table
```

3. **Run migrations:**
```bash
npx sequelize-cli db:migrate
```

4. **Rollback migration:**
```bash
npx sequelize-cli db:migrate:undo
```

### Using npm scripts (recommended)

Add to `package.json`:

```json
{
  "scripts": {
    "migrate": "sequelize-cli db:migrate",
    "migrate:undo": "sequelize-cli db:migrate:undo",
    "migrate:generate": "sequelize-cli migration:generate"
  }
}
```

---

## Current Status

✅ **Models defined** - All 30+ models are defined in `src/models/`

✅ **Associations defined** - All relationships are set up in `src/models/associations.js`

✅ **Indexes defined** - Most models have indexes defined in their schema

⏳ **Migrations** - Migration files need to be generated from models (or created manually)

---

## Production Recommendations

1. **Disable auto-sync in production:**
   ```javascript
   // In database.js
   if (config.NODE_ENV === 'development') {
     await sequelize.sync({ alter: false });
   }
   // Don't sync in production!
   ```

2. **Create migrations for all models:**
   - Generate migrations from existing models using `sequelize-cli`
   - Or create migration files manually following the model definitions

3. **Test migrations:**
   - Test migrations on a staging environment first
   - Always backup database before running migrations

4. **Version control:**
   - Commit all migration files to version control
   - Never modify existing migrations (create new ones instead)

---

## Indexes Strategy

All models already have indexes defined in their schema definitions. Key indexes include:

- **User queries:** `email`, `status`, `createdAt`
- **Order queries:** `userId`, `status`, `createdAt`
- **Enrollment queries:** `userId`, `courseId`, `status`
- **Payment queries:** `status`, `createdAt`, `transactionId`
- **Analytics queries:** Date-based indexes on `createdAt` fields

These indexes are automatically created when using `sequelize.sync()` or when creating tables via migrations.

---

## Next Steps

1. **For Development:** Continue using `sequelize.sync()` (current approach)
2. **For Production:** 
   - Generate migrations from models
   - Or manually create migration files
   - Run migrations before deploying

---

**Note:** Since all models are already defined with proper schemas and indexes, the database will be automatically created when you run the server in development mode. For production, migrate to using Sequelize migrations.

