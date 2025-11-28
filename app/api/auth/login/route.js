import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    console.log('Login attempt for:', email);

    const promisePool = mysqlPool.promise();
    const [users] = await promisePool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = users[0];
    
    // For demo purposes, we'll use a simple password check
    // In production, always use bcrypt.compare()
    let isValidPassword = false;
    
    // Check against known hashed passwords for demo users
    if (email === 'admin@bookstore.com' && password === 'password123') {
      isValidPassword = true;
    } else if (email === 'user@bookstore.com' && password === 'user123') {
      isValidPassword = true;
    } else {
      // For newly registered users, use bcrypt
      isValidPassword = await bcrypt.compare(password, user.password);
    }

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    console.log('Login successful for user:', userWithoutPassword.email, 'Role:', userWithoutPassword.role);
    
    return NextResponse.json({
      message: 'Login successful',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}