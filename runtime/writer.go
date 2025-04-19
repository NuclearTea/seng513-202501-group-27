package runtime

import (
	"os"
	"path/filepath"

	pb "seng513-202501-group-27/gen/filetree"
)

func WriteDirectory(base string, dir *pb.Directory) (string, error) {
	currentPath := filepath.Join(base, filepath.Join(dir.GetPath()...))
	if err := os.MkdirAll(currentPath, 0755); err != nil {
		return "", err
	}

	var packageJSONPath string

	for _, child := range dir.GetChildren() {
		switch x := child.Node.(type) {
		case *pb.Child_File:
			filePath := filepath.Join(currentPath, x.File.GetName())
			if err := os.WriteFile(filePath, []byte(x.File.GetContent()), 0644); err != nil {
				return "", err
			}
			if x.File.GetName() == "package.json" {
				packageJSONPath = filePath
			}
		case *pb.Child_Directory:
			subPath, err := WriteDirectory(base, x.Directory)
			if err != nil {
				return "", err
			}
			if subPath != "" {
				packageJSONPath = subPath
			}
		}
	}
	return packageJSONPath, nil
}
