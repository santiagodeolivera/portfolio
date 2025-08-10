'use strict';

(() => {
	const modules = Object.create(null);
	
	modules.config = Object.freeze({
		__proto__: null,
		dataPath: "/data.json"
	});
	
	modules.utils = (() => {
		
		const defaultErrFn = (error) => {
			console.error(error);
			return null;
		}
		
		function tryCatchWrap(fn, errFn = undefined) {
			try {
				return fn();
			} catch (error) {
				return (errFn ?? defaultErrFn)();
			}
		}
		
		return Object.freeze({
			__proto__: null,
			tryCatchWrap
		});
		
	})();
	
	modules.typing = (() => {
		const state = Symbol("state");
		const check = Symbol("check");
		
		/*
			interface Filter<T, U = Any>:
				[check](value: U) -> (value is T) ? null : string;
		*/
		
		class Filter {
			and(...others) {
				return new ConjunctionFilter(this, ...others);
			}
		}
		
		class SimpleFilter extends Filter {
			constructor(predicate, message) {
				this[state] = {predicate, message};
			}
			
			[check](value) {
				return this[state].predicate(value) ? null : this[state].message;
			}
		}
		
		class FixedDictFilter extends Filter {
			constructor(dict) {
				this[state] = { dict };
			}
			
			check(value) {
				if (typeof value !== "object") {
					throw new Error("Unexpected error");
				}
				
				for (const [key, value] of Object.entries(this[state].dict)) {
					const keyStr = JSON.stringify(key);
					if (!(key in value)) {
						return `Value has no key ${keyStr}`;
					}
					
					const vResult = value.check(value[key]);
					if (vResult !== null) return `Key ${keyStr}: ${vResult}`;
				}
				
				return null;
			}
		}
		
		class VariableDictFilter extends Filter {
			constructor(valueFilter) {
				this[state] = {valueFilter};
			}
			
			[check](value) {
				if (typeof value !== "object") {
					throw new Error("Unexpected error");
				}
				
				for (const [key, value] of Object.entries(value)) {
					const vResult = this[state].valueFilter[check](value);
					if (vResult !== null) return `Key ${key}: ${vResult}`;
				}
				
				return null;
			}
		}
		
		class ConjunctionFilter extends Filter {
			constructor(...filters) {
				this[state] = { filters };
			}
			
			check(value) {
				for (const filter of this[state].filters) {
					const result = filter.check(value);
					if (result !== null) return result;
				}
				return null;
			}
			
			and(...others) {
				return new ConjunctionFilter(...this[state].filters, ...others);
			}
		}
		
		class ListFilter extends Filter {
			constructor(elementFilter) {
				this[state] = { elementFilter };
			}
			
			[check](value) {
				if (!Array.isArray(value)) {
					throw new Error("Unexpected error");
				}
				
				for (const i in value) {
					const el = value[i];
					
					const result = this[state].elementFilter.check(el);
					if (result !== null) return `Index ${i}: ${result}`;
				}
			}
		}
		
		function assertType(filter, value) {
			const result = filter[check](value);
			
			if (result !== null) {
				throw new TypeError(result);
			}
		}
		
		const filters = (() => {
			const list = new SimpleFilter(v => Array.isArray(v), "Expected an array");
			const dict = new SimpleFilter(v => typeof v === "object", "Expected an object");
			const string = new SimpleFilter(v => typeof v === "string", "Expected a string");
			const list2 = (elementFilter) => new ConjunctionFilter(
				list, new ListFilter(elementFilter)
			);
			const fixedDict = (dict) => new ConjunctionFilter(
				dict, new FixedDictFilter(dict)
			);
			const variableDict = (valueFilter) => new ConjunctionFilter(
				dict, new VariableDictFilter(valueFilter)
			);
			
			return Object.freeze({
				__proto__: null,
				list,
				dict,
				string,
				list2,
				fixedDict,
				variableDict
			});
		})();
		
		return Object.freeze({
			__proto__: null,
			assertType,
			filters
		});
	})();
	
	module.tags = (() => {
		const { dataPath } = modules.config;
		const { filters, assertType } = modules.typing;
		
		class GetTagError extends Error {
			constructor(message) {
				super(message);
				this.name = "GetTagError";
			}
		}
		
		class TagContext {
			constructor(categories, tags) {
				this.categories = categories;
				this.tags = tags;
			}
		}
		
		class TagCategory {
			constructor(name) {
				this.name = name;
				this.tags = [];
			}
			
			addTag(tag) {
				this.tags.push(tag);
			}
			
			tags() {
				return {
					[Symbol.iterator]()* {
						for (const tag of this.tags) {
							yield tag;
						}
					}
				};
			}
		}
		
		class Tag {
			constructor(name, category) {
				this.name = name;
				this.category = category;
				category.addTag(this);
			}
		}
		
		class Project {
			constructor(name, path, tags) {
				this.name = name;
				this.path = path;
				this.tags = tags;
			}
		}
		
		function processTags(tagData) {
			const categories = [];
			const tags = [];
			
			for (const categoryName in tagData) {
				const category = new TagCategory(categoryName);
				categories.push(category);
				
				for (const tagName of tagData[categoryName]) {
					const tag = new Tag(tagName, category);
					tags.push(tag);
				}
			}
			
			return new TagContext(categories, tags);
		}
		
		function processProjects(projectData) {
			const projects = [];
			
			for (const name in projectData) {
				const { path, tags } = projectData[name];
				const project = new Project(name, path, tags);
				projects.push(project);
			}
			
			return projects;
		}
		
		const jsonFilter = filters.fixedDict({
			"tags": filters.variableDict(
				filters.list2(filters.string)
			),
			"projects": filters.variableDict(
				filters.fixedDict({
					"path": filters.string,
					"tags": filters.list2(filters.string)
				})
			)
		});
		function processJson(json) {
			assertType(jsonFilter, json);
			
			const {tags, projects} = json;
			
			const tagContext = processTags(tagData);
		}
		
		async function getTagsInner() {
			const response = await fetch(dataPath);
			
			if (!response.ok) {
				throw new GetTagError("Error while fetching project data");
			}
			
			const json = await response.json();
			
			const processed = processJson(json);
			
			return processed;
		}
		
		let tags = undefined;
		
		async function getTags() {
			if (tags !== undefined) {
				return tags;
			}
			
			try {
				tags = await getTagsInner();
				return tags;
			} catch (error) {
				if (error instanceof GetTagError) {
					console.error(error.message);
				}
				
				return null;
			}
		}
		
		return Object.freeze({
			__proto__: null,
			getTags
		});
		
	})();
	
	console.log(
		modules.tags.getTags()
	);
})();
//
