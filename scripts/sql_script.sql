CREATE TABLE public.products (
	id uuid NOT_NULL primary key,
	title text NOT_NULL,
	description text NULL,
	price int4 NULL
);

CREATE TABLE public.stocks (
	product_id uuid NULL,
	count integer NULL,
	CONSTRAINT stocks_fk FOREIGN KEY (product_id) REFERENCES public.products(id)
);


INSERT INTO public.products
(id, title, description, price)
VALUES('7567ec4b-b13c-48c5-9d45-fc73c48a80aa', 'NewProduct', 'Short Product Description', 50);

INSERT INTO public.stocks
(product_id, count)
VALUES('7567ec4b-b13c-48c5-9d45-fc73c48a80aa', 5);


INSERT INTO public.products
(id, title, description, price)
VALUES('7563ec4b-b13c-48c5-9d45-fc71c48a80aa', 'NewProduct2', 'Short Product Description2', 30);

INSERT INTO public.stocks
(product_id, count)
VALUES('7563ec4b-b13c-48c5-9d45-fc71c48a80aa', 3);

INSERT INTO public.products
(id, title, description, price)
VALUES('7567ec4b-b10c-48c5-9345-fc73c48a80aa', 'NewProduct3', 'Short Product Description3', 10);

INSERT INTO public.stocks
(product_id, count)
VALUES('7567ec4b-b10c-48c5-9345-fc73c48a80aa', 2);


select * from products inner join stocks on products.id = stocks.product_id 
