import fs from 'fs';
import path from 'path';

// Local JSON database for development
// This can be easily replaced with a real database later

const DB_PATH = path.join(process.cwd(), '.data');
const USERS_FILE = path.join(DB_PATH, 'users.json');
const PRODUCTS_FILE = path.join(DB_PATH, 'products.json');
const COURSES_FILE = path.join(DB_PATH, 'courses.json');
const SETTINGS_FILE = path.join(DB_PATH, 'settings.json');
const METRICS_FILE = path.join(DB_PATH, 'metrics.json');

// Ensure data directory exists
if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync(DB_PATH, { recursive: true });
}

// Initialize files if they don't exist
const initFile = (filePath: string, defaultData: any) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
  }
};

// Initialize all data files
initFile(USERS_FILE, { users: [] });
initFile(PRODUCTS_FILE, { products: [] });
initFile(COURSES_FILE, { courses: [] });
initFile(SETTINGS_FILE, { settings: {} });
initFile(METRICS_FILE, { metrics: {
  users: { total: 0, active: 0, new: 0 },
  content: { cases: 0, articles: 0, discussions: 0, comments: 0 },
  engagement: { dailyActiveUsers: 0, pageViews: 0, averageSessionTime: 0 },
  moderation: { flaggedContent: 0, pendingReviews: 0, averageResponseTime: 0 }
}});

// Generic read function
const readData = (filePath: string) => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return null;
  }
};

// Generic write function
const writeData = (filePath: string, data: any) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
};

// User operations
export const userDb = {
  getAll: () => {
    const data = readData(USERS_FILE);
    return data?.users || [];
  },
  
  getById: (id: string) => {
    const users = userDb.getAll();
    return users.find((u: any) => u.id === id);
  },
  
  getByEmail: (email: string) => {
    const users = userDb.getAll();
    return users.find((u: any) => u.email === email);
  },
  
  create: (user: any) => {
    const users = userDb.getAll();
    const newUser = {
      ...user,
      id: user.id || `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    users.push(newUser);
    writeData(USERS_FILE, { users });
    
    // Update metrics
    updateMetrics({ users: { total: users.length, new: 1 } });
    
    return newUser;
  },
  
  update: (id: string, updates: any) => {
    const users = userDb.getAll();
    const index = users.findIndex((u: any) => u.id === id);
    if (index === -1) return null;
    
    users[index] = {
      ...users[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    writeData(USERS_FILE, { users });
    return users[index];
  },
  
  delete: (id: string) => {
    const users = userDb.getAll();
    const filtered = users.filter((u: any) => u.id !== id);
    writeData(USERS_FILE, { users: filtered });
    
    // Update metrics
    updateMetrics({ users: { total: filtered.length } });
    
    return true;
  }
};

// Product operations
export const productDb = {
  getAll: () => {
    const data = readData(PRODUCTS_FILE);
    return data?.products || [];
  },
  
  getById: (id: string) => {
    const products = productDb.getAll();
    return products.find((p: any) => p.id === id);
  },
  
  create: (product: any) => {
    const products = productDb.getAll();
    const newProduct = {
      ...product,
      id: product.id || `product-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    products.push(newProduct);
    writeData(PRODUCTS_FILE, { products });
    return newProduct;
  },
  
  update: (id: string, updates: any) => {
    const products = productDb.getAll();
    const index = products.findIndex((p: any) => p.id === id);
    if (index === -1) return null;
    
    products[index] = {
      ...products[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    writeData(PRODUCTS_FILE, { products });
    return products[index];
  },
  
  delete: (id: string) => {
    const products = productDb.getAll();
    const filtered = products.filter((p: any) => p.id !== id);
    writeData(PRODUCTS_FILE, { products: filtered });
    return true;
  }
};

// Course operations
export const courseDb = {
  getAll: () => {
    const data = readData(COURSES_FILE);
    return data?.courses || [];
  },
  
  getById: (id: string) => {
    const courses = courseDb.getAll();
    return courses.find((c: any) => c.id === id);
  },
  
  create: (course: any) => {
    const courses = courseDb.getAll();
    const newCourse = {
      ...course,
      id: course.id || `course-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    courses.push(newCourse);
    writeData(COURSES_FILE, { courses });
    return newCourse;
  },
  
  update: (id: string, updates: any) => {
    const courses = courseDb.getAll();
    const index = courses.findIndex((c: any) => c.id === id);
    if (index === -1) return null;
    
    courses[index] = {
      ...courses[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    writeData(COURSES_FILE, { courses });
    return courses[index];
  },
  
  delete: (id: string) => {
    const courses = courseDb.getAll();
    const filtered = courses.filter((c: any) => c.id !== id);
    writeData(COURSES_FILE, { courses: filtered });
    return true;
  }
};

// Settings operations
export const settingsDb = {
  getAll: () => {
    const data = readData(SETTINGS_FILE);
    return data?.settings || {};
  },
  
  get: (key: string) => {
    const settings = settingsDb.getAll();
    return settings[key];
  },
  
  set: (key: string, value: any) => {
    const settings = settingsDb.getAll();
    settings[key] = {
      value,
      updatedAt: new Date().toISOString()
    };
    writeData(SETTINGS_FILE, { settings });
    return settings[key];
  },
  
  update: (updates: any) => {
    const settings = settingsDb.getAll();
    const newSettings = { ...settings };
    
    Object.keys(updates).forEach(key => {
      newSettings[key] = {
        value: updates[key],
        updatedAt: new Date().toISOString()
      };
    });
    
    writeData(SETTINGS_FILE, { settings: newSettings });
    return newSettings;
  }
};

// Metrics operations
export const metricsDb = {
  get: () => {
    const data = readData(METRICS_FILE);
    return data?.metrics || {};
  },
  
  update: (updates: any) => {
    const metrics = metricsDb.get();
    const newMetrics = mergeDeep(metrics, updates);
    writeData(METRICS_FILE, { metrics: newMetrics });
    return newMetrics;
  },
  
  increment: (path: string, value: number = 1) => {
    const metrics = metricsDb.get();
    const keys = path.split('.');
    let current = metrics;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    
    const lastKey = keys[keys.length - 1];
    current[lastKey] = (current[lastKey] || 0) + value;
    
    writeData(METRICS_FILE, { metrics });
    return metrics;
  }
};

// Helper function to update metrics
const updateMetrics = (updates: any) => {
  metricsDb.update(updates);
};

// Deep merge helper
function mergeDeep(target: any, source: any): any {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
}

function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}

// Initialize with sample data if empty
export const initializeSampleData = () => {
  const users = userDb.getAll();
  if (users.length === 0) {
    // Create admin user
    userDb.create({
      email: 'admin@legacy.com',
      name: 'Admin',
      role: 'admin',
      password: '$2a$10$XQq2o2l6XCmwVxr5FlZYUuK5YSQZ/X8qQ5BqZ3qZqQZqZ3qZqZqZq', // "admin123"
      isActive: true
    });
    
    // Create sample users
    userDb.create({
      email: 'dr.silva@legacy.com',
      name: 'Dr. Ana Silva',
      role: 'user',
      password: '$2a$10$XQq2o2l6XCmwVxr5FlZYUuK5YSQZ/X8qQ5BqZ3qZqQZqZ3qZqZqZq',
      isActive: true
    });
  }
  
  const courses = courseDb.getAll();
  if (courses.length === 0) {
    // Create sample courses
    courseDb.create({
      title: 'Facelift Mastery',
      description: 'Domine as técnicas mais avançadas de facelift',
      instructor: 'Dr. Robério Damasceno',
      price: 2997,
      category: 'Cirurgia Facial',
      level: 'advanced',
      status: 'published',
      featured: true,
      duration: '40 horas',
      students: 234,
      rating: 4.8
    });
  }
  
  const products = productDb.getAll();
  if (products.length === 0) {
    // Create sample products
    productDb.create({
      name: 'Curso Completo de Rinoplastia',
      description: 'Aprenda todas as técnicas de rinoplastia',
      price: 1997,
      category: 'Curso',
      status: 'active',
      stock: 100
    });
  }
};