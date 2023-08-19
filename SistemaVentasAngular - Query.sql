DROP DATABASE SistemaVentasAngular

CREATE DATABASE SistemaVentasAngular
GO

USE SistemaVentasAngular
GO

CREATE TABLE Rol(
Id INT IDENTITY(1,1),
Nombre VARCHAR(50),
CONSTRAINT PK_ROL PRIMARY KEY (Id)
)
GO

CREATE TABLE Menu(
Id INT IDENTITY(1,1),
Nombre VARCHAR(50),
Icono VARCHAR(50),
Url VARCHAR(50),
CONSTRAINT PK_MENU PRIMARY KEY (Id)
)
GO

CREATE TABLE MenuRol(
Id INT IDENTITY(1,1),
IdMenu INT,
IdRol INT,
CONSTRAINT PK_MENUROL PRIMARY KEY (Id),
CONSTRAINT FK_MR_MENU FOREIGN KEY (IdMenu) REFERENCES Menu(Id),
CONSTRAINT FK_MR_ROL FOREIGN KEY (IdRol) REFERENCES Rol(Id)
)
GO

CREATE TABLE Usuario(
Id INT IDENTITY(1,1),
Cedula VARCHAR(15),
Nombre VARCHAR(100),
Correo VARCHAR(40),
Clave VARCHAR(40),
Activo BIT DEFAULT 1,
FechaContrato DATETIME DEFAULT GETDATE(),
RolId INT,
CONSTRAINT PK_USUARIO PRIMARY KEY (Id),
CONSTRAINT FK_USUA_ROL FOREIGN KEY (RolId) REFERENCES Rol(Id)
)
GO

CREATE TABLE Categoria(
Id INT IDENTITY(1,1),
Nombre VARCHAR(50),
Activo BIT DEFAULT 1,
FechaRegistro DATETIME DEFAULT GETDATE(),
CONSTRAINT PK_CATEGORIA PRIMARY KEY (Id)
)
GO

CREATE TABLE Producto(
Id INT IDENTITY(1,1),
Nombre VARCHAR(100),
CantidadInventario INT,
Precio DECIMAL(10,2),
Activo BIT DEFAULT 1,
FechaRegistro DATETIME DEFAULT GETDATE(),
CategoriaId INT,
CONSTRAINT PK_PRODUCTO PRIMARY KEY (Id),
CONSTRAINT FK_PROD_CATEGORIA FOREIGN KEY (CategoriaId) REFERENCES Categoria(Id)
)
GO

create table NumeroDocumento(
Id INT IDENTITY(1,1),
UltimoNumero INT NOT NULL,
FechaRegistro DATETIME DEFAULT GETDATE(),
CONSTRAINT PK_NUMERODOCUMENTO PRIMARY KEY (Id)
)
GO

CREATE TABLE Venta(
Id INT IDENTITY(1,1),
NumeroDocumento VARCHAR(40),
TipoPago VARCHAR(50),
Total DECIMAL(10,2),
FechaRegistro DATETIME DEFAULT GETDATE(),
CONSTRAINT PK_VENTA PRIMARY KEY (Id)
)
GO

CREATE TABLE DetalleVenta(
Id INT IDENTITY(1,1),
VentaId INT,
ProductoId INT,
Cantidad INT,
Precio Decimal(10,2),
Total Decimal(10,2),
CONSTRAINT PK_DETAVENTA PRIMARY KEY (Id),
CONSTRAINT FK_DEVE_VENTAS FOREIGN KEY (VentaId) REFERENCES Venta(Id),
CONSTRAINT FK_DEVE_PRODUCTOS FOREIGN KEY (ProductoId) REFERENCES Producto(Id)
)
GO

-- Insersion de Tablas



INSERT INTO Rol VALUES
('Administrador'),
('Supervisor'),
('Empleado')
GO

INSERT INTO Usuario VALUES 
('123456789', 'Aaron','admin@correo.com','Admin!1234', 1, GETDATE(), 1)
GO

SELECT * FROM Usuario

INSERT INTO Categoria VALUES
('Laptops', 1, GETDATE()),
('Monitores', 1, GETDATE()),
('Teclados',1, GETDATE()),
('Auriculares',1, GETDATE()),
('Memorias',1, GETDATE()),
('Accesorios',1, GETDATE())
GO

SELECT * FROM Categoria

INSERT INTO Menu VALUES
('Dashboard','dashboard','/pages/dashboard'),
('Usuarios','group','/pages/usuarios'),
('Productos','collections_bookmark','/pages/productos'),
('Venta','currency_exchange','/pages/venta'),
('Historial Ventas','edit_note','/pages/historial_venta'),
('Reportes','receipt','/pages/reportes')
GO

INSERT INTO MenuRol VALUES
(1,1),
(2,1),
(3,1),
(4,1),
(5,1),
(6,1)
GO

INSERT INTO MenuRol VALUES
(4,3),
(5,3)
GO

INSERT INTO MenuRol VALUES
(3,2),
(4,2),
(5,2),
(6,2)
GO

INSERT INTO NumeroDocumento VALUES
(0,getdate())
GO


